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
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'user',
            'confirmed' => true,
            'completed_profile' => false,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate the user is an admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'completed_profile' => true,
        ]);
    }

    /**
     * Indicate the user is an employer with a completed profile.
     */
    public function employer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'employer',
            'completed_profile' => true,
        ]);
    }

    /**
     * Indicate the user is a candidate with a completed profile.
     */
    public function candidate(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'candidate',
            'completed_profile' => true,
        ]);
    }
}
