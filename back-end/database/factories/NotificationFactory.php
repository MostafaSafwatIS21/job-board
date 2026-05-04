<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['application', 'message', 'system', 'job']);

        return match ($type) {
            'application' => [
                'user_id' => User::factory(),
                'title' => fake()->randomElement([
                    'New Application Received',
                    'Application Status Update',
                    'Application Approved',
                    'Application Rejected',
                ]),
                'body' => fake()->randomElement([
                    'A candidate has applied to your job listing.',
                    'Your application has been reviewed.',
                    'Congratulations! Your application has been approved.',
                    'Your application was not selected at this time.',
                ]),
                'read' => fake()->boolean(),
            ],
            'message' => [
                'user_id' => User::factory(),
                'title' => 'New Message',
                'body' => 'You have received a new message from ' . fake()->name() . '.',
                'read' => fake()->boolean(),
            ],
            'job' => [
                'user_id' => User::factory(),
                'title' => fake()->randomElement([
                    'New Job Matching Your Profile',
                    'Job Listing Approved',
                    'Job Deadline Approaching',
                ]),
                'body' => fake()->randomElement([
                    'A new job matching your skills has been posted.',
                    'Your job listing has been approved and is now live.',
                    'The deadline for your job listing is approaching.',
                ]),
                'read' => fake()->boolean(),
            ],
            default => [
                'user_id' => User::factory(),
                'title' => 'System Notification',
                'body' => fake()->sentence(),
                'read' => fake()->boolean(),
            ],
        };
    }
}
