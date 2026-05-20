<?php

namespace App\Http\Resources;

use App\Models\Job;
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
            'is_open'           => $this->status === Job::STATUS_OPEN,
            'category'          => $this->whenLoaded(
                'category',
                fn () => new JobCategoryResource($this->category),
            ),
            'bids_count'        => (int) ($this->bids_count ?? 0),
            'has_my_bid'        => $this->when(
                ! is_null($this->getAttribute('has_my_bid')),
                fn () => (bool) $this->getAttribute('has_my_bid'),
            ),
            'posted_at'         => $this->created_at?->toIso8601String(),
            'posted_human'      => $this->created_at?->diffForHumans(),
        ];
    }
}
