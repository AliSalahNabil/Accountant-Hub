<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class JobCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $category) {
            if (empty($category->slug) && ! empty($category->name)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class, 'category_id');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
