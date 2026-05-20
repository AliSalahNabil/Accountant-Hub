<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobCategoryResource;
use App\Models\JobCategory;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobCategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $categories = JobCategory::query()
            ->withCount(['jobs' => fn ($q) => $q->where('status', 'open')])
            ->orderBy('name')
            ->get();

        return JobCategoryResource::collection($categories);
    }
}
