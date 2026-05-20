<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\JobCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Job>
 */
class JobFactory extends Factory
{
    public function definition(): array
    {
        $min = fake()->randomElement([300, 500, 1000, 1500, 2500, 5000]);
        $max = $min + fake()->randomElement([200, 500, 1000, 2500]);

        return [
            'category_id'       => JobCategory::inRandomOrder()->value('id') ?? JobCategory::factory(),
            'title'             => fake()->randomElement([
                'Monthly Bookkeeping for E-commerce Store',
                'Annual Tax Return Preparation',
                'QuickBooks Setup and Migration',
                'Audit Support for SaaS Startup',
                'Payroll Processing for 25 Employees',
                'Financial Statements Cleanup',
                'VAT Filing and Reconciliation',
                'Year-end Closing and Reporting',
                'Forensic Accounting Investigation',
                'IFRS Conversion Project',
            ]) . ' #' . fake()->numberBetween(100, 999),
            'company_name'      => fake()->company(),
            'company_logo'      => null,
            'company_location'  => fake()->city() . ', ' . fake()->country(),
            'short_description' => fake()->sentence(15),
            'description'       => collect([
                fake()->paragraph(5),
                "**What we need:**\n\n- " . implode("\n- ", fake()->sentences(4)),
                "**About us:**\n\n" . fake()->paragraph(3),
            ])->implode("\n\n"),
            'required_skills'   => fake()->randomElements([
                'QuickBooks', 'Xero', 'SAP', 'Excel', 'Tax Filing', 'Audit', 'IFRS', 'GAAP',
                'Bookkeeping', 'Payroll', 'VAT', 'Financial Reporting', 'Reconciliation', 'NetSuite',
            ], fake()->numberBetween(3, 6)),
            'budget_min'        => $min,
            'budget_max'        => $max,
            'currency'          => 'USD',
            'delivery_days'     => fake()->randomElement([7, 14, 21, 30, 45, 60]),
            'deadline'          => fake()->dateTimeBetween('+1 week', '+3 months')->format('Y-m-d'),
            'attachments'       => [],
            'status'            => fake()->randomElement([
                Job::STATUS_OPEN, Job::STATUS_OPEN, Job::STATUS_OPEN, Job::STATUS_OPEN, Job::STATUS_CLOSED,
            ]),
        ];
    }

    public function open(): static
    {
        return $this->state(fn () => ['status' => Job::STATUS_OPEN]);
    }

    public function closed(): static
    {
        return $this->state(fn () => ['status' => Job::STATUS_CLOSED]);
    }
}
