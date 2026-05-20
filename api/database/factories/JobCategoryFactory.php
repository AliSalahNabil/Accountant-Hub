<?php

namespace Database\Factories;

use App\Models\JobCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<JobCategory>
 */
class JobCategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Bookkeeping', 'Tax Preparation', 'Audit & Assurance', 'Payroll',
            'Financial Analysis', 'Forensic Accounting', 'Management Accounting',
        ]);

        return [
            'name'        => $name,
            'slug'        => Str::slug($name),
            'icon'        => null,
            'description' => fake()->sentence(),
        ];
    }
}
