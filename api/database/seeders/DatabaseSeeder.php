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

        // Curated featured jobs — title, description, and category all match.
        $featured = [
            [
                'category' => 'Bookkeeping',
                'title'    => 'Monthly Bookkeeping for Series A SaaS Startup',
                'company'  => 'CloudLedger Inc.',
                'location' => 'San Francisco, USA',
                'budget'   => [800, 1500],
                'days'     => 30,
                'skills'   => ['QuickBooks', 'Xero', 'Bookkeeping', 'Reconciliation', 'Financial Reporting'],
                'short'    => 'Series A SaaS company needs a dedicated bookkeeper for monthly close, payroll reconciliation, and clean management reporting.',
                'desc'     => "We've raised our Series A and our books need to graduate from \"founder-managed\" to clean monthly close. We're hiring a fractional bookkeeper to own the cadence.\n\n**What we need every month:**\n\n- Reconcile Stripe, bank, and credit card accounts by the 5th of the next month\n- Categorize all SaaS subscription expenses and prepaids per ASC 340-40\n- Track deferred revenue and recognize per ASC 606\n- Deliver a board-ready P&L, BS, and cashflow on the 7th\n\n**Tools:**\n\nQuickBooks Online, Stripe, Brex, Gusto, Bill.com. We work async on Slack with one monthly 30-minute review call.\n\n**About us:**\n\n22-person remote team, \$3.2M ARR, growing 8% MoM. We move fast but value precision.",
            ],
            [
                'category' => 'Tax Preparation',
                'title'    => 'US Corporate Tax Return (Form 1120) — FY 2025',
                'company'  => 'Northwind Holdings',
                'location' => 'Wilmington, USA',
                'budget'   => [1200, 2500],
                'days'     => 21,
                'skills'   => ['Tax Filing', 'GAAP', 'Excel', 'QuickBooks'],
                'short'    => 'Delaware C-Corp needs end-to-end FY 2025 federal and state tax return preparation plus K-1s for three shareholders.',
                'desc'     => "Delaware C-Corp (operations in California) needs FY 2025 returns prepared and filed by a licensed CPA.\n\n**Scope:**\n\n- Form 1120 federal corporate return with all relevant schedules\n- California Form 100 with state-specific adjustments\n- Three K-1s for shareholders (one foreign-resident — additional W-8BEN considerations)\n- R&D tax credit study (Form 6765) — we estimate \$180K of qualified expenses\n- Estimated quarterly filings calendar for next FY\n\n**Books:**\n\nClean GAAP in NetSuite. Prior-year return and trial balance available for review.\n\n**Timing:**\n\nWe need a draft within 3 weeks of kickoff. Final filing by the standard September extended deadline.",
            ],
            [
                'category' => 'Audit & Assurance',
                'title'    => 'External Audit Support — 12 month engagement',
                'company'  => 'Acme Manufacturing',
                'location' => 'Cleveland, USA',
                'budget'   => [5000, 9000],
                'days'     => 60,
                'skills'   => ['Audit', 'GAAP', 'NetSuite', 'Financial Reporting'],
                'short'    => 'Mid-market manufacturer needs a year-round audit liaison: maintain workpapers, lead PBC requests, and be the auditor’s point of contact.',
                'desc'     => "We engaged a new audit firm this year and rather than scrambling at year-end we want a year-round liaison to keep the audit trail clean.\n\n**Engagement scope:**\n\n- Quarterly review of journal entries with supporting documentation\n- Maintain the audit binder (revenue, AR aging, inventory, fixed assets)\n- Walkthrough memos for material processes (revenue, expenditures, payroll)\n- Be the auditor's primary point of contact during interim and year-end fieldwork\n- Help us close any prior-year deficiencies before this audit cycle starts\n\n**About us:**\n\nMid-market manufacturer, ~\$45M annual revenue, NetSuite ERP, two physical locations. We have a competent local accounting team — we need a senior partner to keep them organized.",
            ],
            [
                'category' => 'Payroll',
                'title'    => 'Bi-weekly Payroll for 40-person team (Multi-state)',
                'company'  => 'Sunrise Logistics',
                'location' => 'Austin, USA',
                'budget'   => [600, 1200],
                'days'     => 30,
                'skills'   => ['Payroll', 'Excel'],
                'short'    => 'Established logistics company needs a payroll specialist for bi-weekly runs, quarterly filings, and year-end W-2/1099 preparation.',
                'desc'     => "We currently run payroll in-house on Gusto, but our COO is stretched thin and we'd like to outsource the recurring work.\n\n**What's involved:**\n\n- Bi-weekly payroll runs for 40 W-2 employees across CA, NY, TX, and FL\n- Manage 401(k) contributions and remittances each cycle\n- Quarterly 941 and state-level filings\n- Annual W-2 issuance + 1099 management for ~12 contractors\n- Monthly headcount and payroll-cost summary to leadership\n\n**About us:**\n\nWe're a 40-person remote-first logistics company. We pay competitive monthly retainers for accountants we trust, and we prefer long-term engagements over short gigs.",
            ],
            [
                'category' => 'Financial Analysis',
                'title'    => '3-Statement Financial Model & 5-Year Forecast',
                'company'  => 'Helix Biotech',
                'location' => 'Boston, USA',
                'budget'   => [2000, 4000],
                'days'     => 14,
                'skills'   => ['Excel', 'Financial Reporting', 'GAAP'],
                'short'    => 'Build a polished, investor-ready 3-statement model with a 5-year forecast for our upcoming Series A fundraise.',
                'desc'     => "We're preparing for a Series A raise in Q3 and need a polished financial model to share with prospective investors.\n\n**Model requirements:**\n\n- 5-year forecast: monthly granularity for years 1–2, quarterly thereafter\n- Fully linked P&L, balance sheet, and cashflow statement\n- Driver-based — pricing, headcount, churn, CAC payback all editable inputs\n- Three scenarios (base / upside / downside) on a single tab\n- Investor-ready summary tab with cohort charts, magic number, burn multiple\n\n**What we'll provide:**\n\nHistorical financials (24 months), current ARR book, hiring plan, and unit economics. Familiarity with SaaS metrics is required (NRR, GRR, CAC payback).",
            ],
            [
                'category' => 'IFRS & GAAP',
                'title'    => 'IFRS to US GAAP Conversion for Subsidiary',
                'company'  => 'Globex Corp',
                'location' => 'New York, USA',
                'budget'   => [4500, 7500],
                'days'     => 45,
                'skills'   => ['IFRS', 'GAAP', 'NetSuite', 'Financial Reporting'],
                'short'    => 'US parent needs IFRS-to-US-GAAP conversion of its European subsidiary, including restating two prior years.',
                'desc'     => "Our European subsidiary reports locally under IFRS; the US parent consolidates under US GAAP. We need a structured conversion to reduce the friction at every close.\n\n**Project deliverables:**\n\n- Gap analysis between current IFRS treatment and US GAAP for each material account\n- Draft US GAAP accounting policy memos for revenue (ASC 606), leases (ASC 842), impairment, and inventory\n- Restate two prior years' subsidiary financials under US GAAP\n- Train our local controller on ongoing GAAP-book maintenance\n\n**About us:**\n\nMid-market manufacturer with consolidated revenue ~\$45M. Books in NetSuite. Local team is technically strong but new to GAAP nuances.",
            ],
        ];

        foreach ($featured as $entry) {
            $category = JobCategory::where('name', $entry['category'])->first();
            Job::factory()
                ->open()
                ->create([
                    'category_id'       => $category->id,
                    'title'             => $entry['title'],
                    'company_name'      => $entry['company'],
                    'company_location'  => $entry['location'],
                    'budget_min'        => $entry['budget'][0],
                    'budget_max'        => $entry['budget'][1],
                    'delivery_days'     => $entry['days'],
                    'short_description' => $entry['short'],
                    'description'       => $entry['desc'],
                    'required_skills'   => $entry['skills'],
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
