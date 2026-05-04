<?php

namespace Database\Factories;

use App\Models\EmployerCandidate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EmployerCandidate>
 */
class EmployerCandidateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->candidate(),
            'headline' => fake()->randomElement([
                'Full-Stack Developer | React & Laravel',
                'Senior UI/UX Designer',
                'Data Scientist & ML Engineer',
                'DevOps Engineer | AWS Certified',
                'Mobile Developer | Flutter & React Native',
                'Backend Developer | Node.js & Python',
                'Frontend Engineer | React & TypeScript',
                'Cloud Solutions Architect',
            ]),
            'phone' => fake()->phoneNumber(),
            'location' => fake()->randomElement([
                'Cairo, Egypt',
                'Alexandria, Egypt',
                'Giza, Egypt',
                'Dubai, UAE',
                'Riyadh, Saudi Arabia',
            ]),
            'resume_url' => fake()->url(),
            'social_media' => [
                'linkedin' => 'https://linkedin.com/in/' . fake()->userName(),
                'github' => 'https://github.com/' . fake()->userName(),
                'portfolio' => fake()->url(),
            ],
        ];
    }
}
