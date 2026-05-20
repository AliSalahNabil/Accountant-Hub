<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bid extends Model
{
    use HasFactory;

    public const STATUS_PENDING   = 'pending';
    public const STATUS_ACCEPTED  = 'accepted';
    public const STATUS_REJECTED  = 'rejected';
    public const STATUS_WITHDRAWN = 'withdrawn';

    protected $fillable = [
        'job_id',
        'user_id',
        'proposed_price',
        'delivery_days',
        'cover_letter',
        'experience_summary',
        'status',
    ];

    protected $casts = [
        'proposed_price' => 'decimal:2',
        'delivery_days'  => 'integer',
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
