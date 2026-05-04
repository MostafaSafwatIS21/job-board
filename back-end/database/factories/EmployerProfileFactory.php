<?php

namespace Database\Factories;

use App\Models\EmployerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployerProfile>
 */
class EmployerProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $companyName = fake()->unique()->company();

        return [
            'user_id' => User::factory()->employer(),
            'company_name' => $companyName,
            'company_description' => fake()->paragraphs(2, true),
            'company_website' => fake()->url(),
            'company_logo' => null,
            'company_location' => fake()->randomElement([
                'Cairo, Egypt',
                'Alexandria, Egypt',
                'Giza, Egypt',
                'Dubai, UAE',
                'Riyadh, Saudi Arabia',
                'Berlin, Germany',
                'London, UK',
            ]),
        ];
    }
}
