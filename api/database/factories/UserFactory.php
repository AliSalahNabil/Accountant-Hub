<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name'                => fake()->name(),
            'email'               => fake()->unique()->safeEmail(),
            'email_verified_at'   => now(),
            'password'            => static::$password ??= Hash::make('password'),
            'headline'            => fake()->randomElement([
                'Certified Public Accountant',
                'Senior Tax Specialist',
                'Bookkeeping Professional',
                'Financial Analyst',
                'Audit & Assurance Expert',
                'Payroll & HR Accountant',
            ]),
            'bio'                 => fake()->randomElement([
                'Experienced accountant focused on US small-business bookkeeping, monthly close, and tax preparation. QuickBooks ProAdvisor since 2018.',
                'CPA with a decade of public accounting experience. I specialize in audit support, SOC 1/2 readiness, and IFRS conversions for mid-market clients.',
                'Tax specialist serving freelancers and SMBs across the US. I file federal and multi-state returns, handle quarterly estimates, and resolve IRS notices.',
                'I help fast-moving SaaS and e-commerce teams keep clean, audit-ready books. Strong in NetSuite, Xero, and revenue recognition under ASC 606.',
                'Payroll and HR-ops accountant. I run multi-state bi-weekly payroll, manage 401(k) contributions, and own quarterly and year-end filings.',
                'Forensic accountant supporting law firms and internal-investigation teams. Detail-oriented, discreet, and report-driven.',
            ]),
            'skills'              => fake()->randomElements([
                'QuickBooks', 'Xero', 'SAP', 'Excel', 'Tax Filing', 'Audit', 'IFRS', 'GAAP',
                'Bookkeeping', 'Payroll', 'VAT', 'Financial Reporting', 'Reconciliation',
            ], 5),
            'years_of_experience' => fake()->numberBetween(1, 20),
            'remember_token'      => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
