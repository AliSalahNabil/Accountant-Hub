<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'slug'              => $this->slug,
            'title'             => $this->title,
            'company' => [
                'name'     => $this->company_name,
                'logo'     => $this->company_logo,
                'location' => $this->company_location,
            ],
            'short_description' => $this->short_description,
            'description'       => $this->when(
                $request->routeIs('jobs.show') || $request->boolean('detailed'),
                fn () => $this->description,
            ),
            'required_skills'   => $this->required_skills ?? [],
            'budget' => [
                'min'      => (float) $this->budget_min,
                'max'      => (float) $this->budget_max,
                'currency' => $this->currency,
            ],
            'delivery_days'     => $this->delivery_days,
            'deadline'          => $this->deadline?->toDateString(),
            'attachments'       => $this->attachments ?? [],
            'status'            => $this->status,
            'is_open'           => $this->status === \App\Models\Job::STATUS_OPEN,
            'category'          => new JobCategoryResource($this->whenLoaded('category')),
            'bids_count'        => (int) ($this->bids_count ?? 0),
            'has_my_bid'        => $this->when(
                $request->user() !== null,
                fn () => $this->bids()->where('user_id', $request->user()->id)->exists(),
            ),
            'posted_at'         => $this->created_at?->toIso8601String(),
            'posted_human'      => $this->created_at?->diffForHumans(),
        ];
    }
}
