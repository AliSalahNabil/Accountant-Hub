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
    private const COVER_LETTERS = [
        "Hello, I'd love to take this on. I've handled almost identical engagements for two SaaS clients this year. I can start within a week, deliver clean reconciled books on time, and keep clear month-end documentation. Happy to share references and a sample report.",
        "Hi — this is exactly the kind of work I focus on. My approach is to spend the first week on diagnostic cleanup, then settle into a predictable monthly cadence with a fixed close calendar. Let me know if you'd like to jump on a 20-minute discovery call.",
        "Thanks for posting this. I'm a CPA with 12 years of experience and I've delivered similar projects under tight timelines without surprises. I'd document scope, edge cases, and a clear go-live plan up front so there are no late-stage gaps.",
        "I'd be a strong fit. I've migrated 30+ companies onto QuickBooks Online over the years and I know exactly how to avoid the common pitfalls (mid-year migrations, AR/AP openers, sales-tax cutover). I can deliver in the timeline you've described.",
        "Happy to take this on. I've run multi-state payroll for teams of similar size for the last 5 years, including 401(k) remittances and quarterly filings. Long-term retainer arrangements work well for me — I'd rather know your business deeply than churn through gigs.",
        "Hello, I read the brief carefully. The scope you described is realistic and I can hit your deadline. I'd propose a fixed-fee engagement with two milestone check-ins so you can see progress and adjust if priorities shift.",
    ];

    private const EXPERIENCE_SUMMARIES = [
        "10+ years bookkeeping for SaaS and e-commerce companies. QuickBooks ProAdvisor since 2019. Past clients include several Y Combinator startups and one publicly traded reseller.",
        "CPA (active license, CA). Big-4 audit alumnus with 6 years in industry as a controller before moving to fractional CFO work. Specialized in SOC readiness and ASC 606.",
        "Enrolled Agent with the IRS, 8 years preparing returns for small businesses and individuals. Handled ~120 returns last filing season with a zero-amendment record.",
        "8 years running payroll for distributed teams. Comfortable with Gusto, Rippling, and Justworks. Multi-state expertise across CA, NY, TX, FL, and remote contractors.",
        "Forensic accounting work for two AmLaw 100 firms. Built quantification models that have held up under deposition. Discreet and audit-trail oriented.",
        "Mid-market financial-modeling background. Built investor-ready 3-statement models for 25+ raises, including 9 SaaS Series-A rounds in the past 18 months.",
    ];

    public function definition(): array
    {
        return [
            'job_id'             => Job::factory(),
            'user_id'            => User::factory(),
            'proposed_price'     => fake()->randomFloat(2, 200, 8000),
            'delivery_days'      => fake()->randomElement([7, 14, 21, 30, 45]),
            'cover_letter'       => fake()->randomElement(self::COVER_LETTERS),
            'experience_summary' => fake()->randomElement(self::EXPERIENCE_SUMMARIES),
            'status'             => fake()->randomElement([
                Bid::STATUS_PENDING, Bid::STATUS_PENDING, Bid::STATUS_PENDING,
                Bid::STATUS_ACCEPTED, Bid::STATUS_REJECTED,
            ]),
        ];
    }
}
