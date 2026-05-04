<?php

namespace Database\Factories;

use App\Models\JobListing;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobListing>
 */
class JobListingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $salaryMin = fake()->numberBetween(1000, 5000);
        $salaryMax = $salaryMin + fake()->numberBetween(500, 3000);

        $allSkills = [
            'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
            'Laravel', 'PHP', 'Vue.js', 'Angular', 'Tailwind CSS',
            'Redux', 'GraphQL', 'REST API', 'Docker', 'Kubernetes',
            'AWS', 'Azure', 'GCP', 'CI/CD', 'Git',
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
            'Figma', 'Design Systems', 'Prototyping', 'UX Research',
            'Flutter', 'React Native', 'Swift', 'Kotlin',
            'Machine Learning', 'Data Analysis', 'Pandas', 'TensorFlow',
            'Agile', 'Scrum', 'Jira', 'Confluence',
        ];

        $skills = fake()->randomElements($allSkills, fake()->numberBetween(2, 6));

        return [
            'employer_id' => User::factory()->employer(),
            'category_id' => Category::factory(),
            'title' => fake()->randomElement([
                'Senior Frontend Engineer',
                'Backend Developer',
                'Full-Stack Developer',
                'UI/UX Designer',
                'Product Designer',
                'DevOps Engineer',
                'Data Scientist',
                'Mobile Developer',
                'QA Engineer',
                'Project Manager',
                'Junior Backend Developer',
                'Machine Learning Engineer',
                'Cloud Architect',
                'Security Analyst',
                'Technical Writer',
            ]),
            'description' => fake()->paragraphs(3, true),
            'location' => fake()->randomElement([
                'Cairo, Egypt',
                'Alexandria, Egypt',
                'Giza, Egypt',
                'Remote',
                'Dubai, UAE',
                'Riyadh, Saudi Arabia',
                'Berlin, Germany',
                'London, UK',
            ]),
            'work_type' => fake()->randomElement(['remote', 'on_site']),
            'experience_level' => fake()->randomElement([
                'entry_level',
                'mid_level',
                'senior_level',
                'executive_level',
            ]),
            'salary_min' => $salaryMin,
            'salary_max' => $salaryMax,
            'deadline' => fake()->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
            'skills' => $skills,
            'status' => fake()->randomElement(['draft', 'pending', 'approved', 'approved', 'approved', 'rejected', 'closed']),
        ];
    }

    /**
     * Indicate the job listing is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    /**
     * Indicate the job listing is a remote job.
     */
    public function remote(): static
    {
        return $this->state(fn (array $attributes) => [
            'work_type' => 'remote',
            'location' => 'Remote',
        ]);
    }

    /**
     * Indicate the job listing is on-site.
     */
    public function onSite(): static
    {
        return $this->state(fn (array $attributes) => [
            'work_type' => 'on_site',
        ]);
    }
}
