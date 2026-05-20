<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('job_categories')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('company_name');
            $table->string('company_logo')->nullable();
            $table->string('company_location')->nullable();
            $table->text('short_description');
            $table->longText('description');
            $table->json('required_skills')->nullable();
            $table->decimal('budget_min', 12, 2);
            $table->decimal('budget_max', 12, 2);
            $table->string('currency', 8)->default('USD');
            $table->unsignedSmallInteger('delivery_days');
            $table->date('deadline');
            $table->json('attachments')->nullable();
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('category_id');
            $table->index('budget_max');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
