<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BidResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'job_id'             => $this->job_id,
            'user_id'            => $this->user_id,
            'proposed_price'     => (float) $this->proposed_price,
            'delivery_days'      => $this->delivery_days,
            'cover_letter'       => $this->cover_letter,
            'experience_summary' => $this->experience_summary,
            'status'             => $this->status,
            'submitted_at'       => $this->created_at?->toIso8601String(),
            'submitted_human'    => $this->created_at?->diffForHumans(),
            'job'                => new JobResource($this->whenLoaded('job')),
            'user'               => new UserResource($this->whenLoaded('user')),
        ];
    }
}
