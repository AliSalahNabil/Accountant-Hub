<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobIndexRequest;
use App\Http\Resources\JobResource;
use App\Models\Job;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index(JobIndexRequest $request): AnonymousResourceCollection
    {
        $query = Job::query()
            ->with(['category'])
            ->withCount('bids');

        // If the request is authenticated via Sanctum, eager-mark "my bid" status
        // with a single SQL EXISTS to avoid N+1 in the listing.
        $user = auth('sanctum')->user();
        if ($user) {
            $query->withExists([
                'bids as has_my_bid' => fn ($q) => $q->where('user_id', $user->id),
            ]);
        }

        $status = $request->input('status', 'open');
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $query->search($request->input('search'))
              ->inBudget(
                  $request->filled('budget_min') ? (float) $request->input('budget_min') : null,
                  $request->filled('budget_max') ? (float) $request->input('budget_max') : null,
              );

        if ($category = $request->input('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        match ($request->input('sort', 'newest')) {
            'oldest'      => $query->orderBy('created_at'),
            'budget_high' => $query->orderByDesc('budget_max')->orderByDesc('created_at'),
            'budget_low'  => $query->orderBy('budget_min')->orderByDesc('created_at'),
            'deadline'    => $query->orderBy('deadline'),
            default       => $query->orderByDesc('created_at'),
        };

        $perPage = (int) $request->input('per_page', 9);

        return JobResource::collection($query->paginate($perPage)->withQueryString());
    }

    public function show(Request $request, string $slug): JobResource
    {
        $query = Job::query()
            ->where('slug', $slug)
            ->with(['category'])
            ->withCount('bids');

        $user = auth('sanctum')->user();
        if ($user) {
            $query->withExists([
                'bids as has_my_bid' => fn ($q) => $q->where('user_id', $user->id),
            ]);
        }

        return JobResource::make($query->firstOrFail());
    }
}
