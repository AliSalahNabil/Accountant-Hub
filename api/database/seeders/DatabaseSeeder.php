<?php

namespace Database\Seeders;

use App\Models\Bid;
use App\Models\Job;
use App\Models\JobCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            JobCategorySeeder::class,
        ]);

        // Demo accountant — credentials documented in the README
        $demo = User::updateOrCreate(
            ['email' => 'accountant@demo.com'],
            [
                'name'                => 'Sarah Demo',
                'password'            => Hash::make('password123'),
                'email_verified_at'   => now(),
                'headline'            => 'Senior Accountant · QuickBooks ProAdvisor',
                'bio'                 => '10+ years of bookkeeping and tax experience across SaaS, e-commerce, and professional services. CPA licensed.',
                'skills'              => ['QuickBooks', 'Xero', 'Tax Filing', 'VAT', 'Bookkeeping', 'Excel', 'Reconciliation'],
                'years_of_experience' => 10,
            ]
        );

        // A handful of additional accountants for realistic bid counts
        $accountants = User::factory()->count(15)->create();
        $accountants->push($demo);

        // Curated featured jobs to make the list look intentional, not random
        $featured = [
            [
                'category' => 'Bookkeeping',
                'title'    => 'Monthly Bookkeeping for Series A SaaS Startup',
                'company'  => 'CloudLedger Inc.',
                'budget'   => [800, 1500],
                'days'     => 30,
            ],
            [
                'category' => 'Tax Preparation',
                'title'    => 'US Corporate Tax Return (Form 1120) — FY 2025',
                'company'  => 'Northwind Holdings',
                'budget'   => [1200, 2500],
                'days'     => 21,
            ],
            [
                'category' => 'Audit & Assurance',
                'title'    => 'External Audit Support — 12 month engagement',
                'company'  => 'Acme Manufacturing',
                'budget'   => [5000, 9000],
                'days'     => 60,
            ],
            [
                'category' => 'Payroll',
                'title'    => 'Bi-weekly Payroll for 40-person team (Multi-state)',
                'company'  => 'Sunrise Logistics',
                'budget'   => [600, 1200],
                'days'     => 30,
            ],
            [
                'category' => 'Financial Analysis',
                'title'    => '3-Statement Financial Model & 5-Year Forecast',
                'company'  => 'Helix Biotech',
                'budget'   => [2000, 4000],
                'days'     => 14,
            ],
            [
                'category' => 'IFRS & GAAP',
                'title'    => 'IFRS to US GAAP Conversion for Subsidiary',
                'company'  => 'Globex Corp',
                'budget'   => [4500, 7500],
                'days'     => 45,
            ],
        ];

        foreach ($featured as $entry) {
            $category = JobCategory::where('name', $entry['category'])->first();
            Job::factory()
                ->open()
                ->create([
                    'category_id'   => $category->id,
                    'title'         => $entry['title'],
                    'company_name'  => $entry['company'],
                    'budget_min'    => $entry['budget'][0],
                    'budget_max'    => $entry['budget'][1],
                    'delivery_days' => $entry['days'],
                ]);
        }

        // Random jobs to fill out the catalog
        Job::factory()->count(24)->create();

        // Random bids
        Job::query()->inRandomOrder()->take(20)->get()->each(function (Job $job) use ($accountants, $demo) {
            $bidders = $accountants->random(min($accountants->count(), random_int(1, 5)));
            foreach ($bidders as $bidder) {
                if ($job->bids()->where('user_id', $bidder->id)->exists()) {
                    continue;
                }
                if ($job->status !== Job::STATUS_OPEN && $bidder->id === $demo->id) {
                    continue;
                }
                Bid::factory()->create([
                    'job_id'  => $job->id,
                    'user_id' => $bidder->id,
                ]);
            }
        });

        // Ensure the demo user has a few bids to populate Dashboard
        $demoTargets = Job::open()
            ->whereDoesntHave('bids', fn ($q) => $q->where('user_id', $demo->id))
            ->inRandomOrder()->take(3)->get();

        foreach ($demoTargets as $job) {
            Bid::factory()->create([
                'job_id'  => $job->id,
                'user_id' => $demo->id,
                'status'  => Bid::STATUS_PENDING,
            ]);
        }
    }
}
