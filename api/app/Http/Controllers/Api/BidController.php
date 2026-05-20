<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBidRequest;
use App\Http\Resources\BidResource;
use App\Models\Bid;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class BidController extends Controller
{
    public function store(StoreBidRequest $request, string $jobSlug): JsonResponse
    {
        $job = Job::where('slug', $jobSlug)->firstOrFail();

        if ($job->status !== Job::STATUS_OPEN) {
            return response()->json([
                'message' => 'This job is no longer accepting bids.',
            ], Response::HTTP_CONFLICT);
        }

        if ($job->bids()->where('user_id', $request->user()->id)->exists()) {
            return response()->json([
                'message' => 'You have already submitted a bid for this job.',
            ], Response::HTTP_CONFLICT);
        }

        $data = $request->validated();

        $bid = $job->bids()->create([
            'user_id'            => $request->user()->id,
            'proposed_price'     => $data['proposed_price'],
            'delivery_days'      => $data['delivery_days'],
            'cover_letter'       => $data['cover_letter'],
            'experience_summary' => $data['experience_summary'],
        ]);

        return response()->json([
            'message' => 'Your bid has been submitted successfully!',
            'bid'     => new BidResource($bid->load('job.category')),
        ], Response::HTTP_CREATED);
    }

    public function myBids(Request $request): AnonymousResourceCollection
    {
        $bids = $request->user()->bids()
            ->with(['job.category'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return BidResource::collection($bids);
    }

    public function show(Request $request, Bid $bid): BidResource
    {
        abort_unless($bid->user_id === $request->user()->id, 403);

        return BidResource::make($bid->load('job.category'));
    }

    public function destroy(Request $request, Bid $bid): JsonResponse
    {
        abort_unless($bid->user_id === $request->user()->id, 403);

        if ($bid->status !== Bid::STATUS_PENDING) {
            return response()->json([
                'message' => 'You can only withdraw pending bids.',
            ], Response::HTTP_CONFLICT);
        }

        $bid->update(['status' => Bid::STATUS_WITHDRAWN]);

        return response()->json([
            'message' => 'Bid withdrawn successfully.',
            'bid'     => new BidResource($bid->fresh()->load('job.category')),
        ]);
    }
}
