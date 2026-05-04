<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'job_id' => JobListing::factory()->approved(),
            'candidate_id' => User::factory()->candidate(),
            'links' => [
                ['label' => 'Portfolio', 'url' => fake()->url()],
                ['label' => 'GitHub', 'url' => 'https://github.com/' . fake()->userName()],
            ],
            'cover_letter' => fake()->paragraphs(3, true),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
        ];
    }

    /**
     * Indicate the application is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate the application is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }
}
