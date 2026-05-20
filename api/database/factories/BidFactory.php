<?php

namespace Database\Factories;

use App\Models\Bid;
use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Bid>
 */
class BidFactory extends Factory
{
    public function definition(): array
    {
        return [
            'job_id'             => Job::factory(),
            'user_id'            => User::factory(),
            'proposed_price'     => fake()->randomFloat(2, 200, 8000),
            'delivery_days'      => fake()->randomElement([7, 14, 21, 30, 45]),
            'cover_letter'       => fake()->paragraphs(2, true),
            'experience_summary' => fake()->paragraph(),
            'status'             => fake()->randomElement([
                Bid::STATUS_PENDING, Bid::STATUS_PENDING, Bid::STATUS_PENDING,
                Bid::STATUS_ACCEPTED, Bid::STATUS_REJECTED,
            ]),
        ];
    }
}
