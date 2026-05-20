<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $totals = Bid::where('user_id', $userId)
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) as pending")
            ->selectRaw("SUM(CASE WHEN status = 'accepted'  THEN 1 ELSE 0 END) as accepted")
            ->selectRaw("SUM(CASE WHEN status = 'rejected'  THEN 1 ELSE 0 END) as rejected")
            ->selectRaw("SUM(CASE WHEN status = 'withdrawn' THEN 1 ELSE 0 END) as withdrawn")
            ->first();

        return response()->json([
            'stats' => [
                'total_bids'     => (int) ($totals->total ?? 0),
                'pending_bids'   => (int) ($totals->pending ?? 0),
                'accepted_bids'  => (int) ($totals->accepted ?? 0),
                'rejected_bids'  => (int) ($totals->rejected ?? 0),
                'withdrawn_bids' => (int) ($totals->withdrawn ?? 0),
            ],
        ]);
    }
}
