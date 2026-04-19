<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(["name", "email", "password", "role", "avatar"])]
#[Hidden(["password", "remember_token"])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            "email_verified_at" => "datetime",
            "password" => "hashed",
        ];
    }

    /**
     * Employer profile for this user.
     */
    public function employerProfile(): HasOne
    {
        return $this->hasOne(EmployerProfile::class);
    }

    /**
     * Candidate records associated with this user.
     */
    public function employerCandidates(): HasMany
    {
        return $this->hasMany(EmployerCandidate::class);
    }

    /**
     * Job listings posted by this user as an employer.
     */
    public function jobListings(): HasMany
    {
        return $this->hasMany(JobListing::class, "employer_id");
    }

    /**
     * Applications submitted by this user as a candidate.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, "candidate_id");
    }

    /**
     * Messages sent by this user.
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, "sender_id");
    }

    /**
     * Messages received by this user.
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, "receiver_id");
    }

    /**
     * Notifications belonging to this user.
     */
    public function userNotifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
