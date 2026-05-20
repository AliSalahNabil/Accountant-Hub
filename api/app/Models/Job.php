<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Job extends Model
{
    use HasFactory;

    public const STATUS_OPEN   = 'open';
    public const STATUS_CLOSED = 'closed';

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'company_name',
        'company_logo',
        'company_location',
        'short_description',
        'description',
        'required_skills',
        'budget_min',
        'budget_max',
        'currency',
        'delivery_days',
        'deadline',
        'attachments',
        'status',
    ];

    protected $casts = [
        'required_skills' => 'array',
        'attachments'     => 'array',
        'budget_min'      => 'decimal:2',
        'budget_max'      => 'decimal:2',
        'delivery_days'   => 'integer',
        'deadline'        => 'date',
    ];

    protected $appends = ['bids_count'];

    protected static function booted(): void
    {
        static::saving(function (self $job) {
            if (empty($job->slug) && ! empty($job->title)) {
                $base = Str::slug($job->title);
                $slug = $base;
                $i = 2;
                while (self::where('slug', $slug)->where('id', '!=', $job->id)->exists()) {
                    $slug = "{$base}-{$i}";
                    $i++;
                }
                $job->slug = $slug;
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(JobCategory::class, 'category_id');
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }

    public function getBidsCountAttribute(): int
    {
        if (array_key_exists('bids_count', $this->relations) || $this->relationLoaded('bids')) {
            return $this->bids->count();
        }

        return (int) ($this->attributes['bids_count'] ?? $this->bids()->count());
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_OPEN);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        $like = '%' . str_replace(['%', '_'], ['\%', '\_'], $term) . '%';

        return $query->where(function (Builder $q) use ($like) {
            $q->where('title', 'like', $like)
              ->orWhere('company_name', 'like', $like)
              ->orWhere('short_description', 'like', $like);
        });
    }

    public function scopeInBudget(Builder $query, ?float $min, ?float $max): Builder
    {
        if ($min !== null) {
            $query->where('budget_max', '>=', $min);
        }
        if ($max !== null) {
            $query->where('budget_min', '<=', $max);
        }
        return $query;
    }
}
