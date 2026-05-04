<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Category;
use App\Models\EmployerCandidate;
use App\Models\EmployerProfile;
use App\Models\JobListing;
use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ─── 1. Categories ───────────────────────────────────────────
        $categories = Category::factory()->createMany([
            ['name' => 'Software Engineering'],
            ['name' => 'Data Science'],
            ['name' => 'UI/UX Design'],
            ['name' => 'Product Management'],
            ['name' => 'DevOps & Cloud'],
            ['name' => 'Mobile Development'],
            ['name' => 'Cybersecurity'],
            ['name' => 'Marketing'],
            ['name' => 'Finance & Accounting'],
            ['name' => 'Human Resources'],
        ]);

        // ─── 2. Admin User ───────────────────────────────────────────
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
        ]);

        // ─── 3. Employer Users + Profiles ────────────────────────────
        $employerData = [
            ['name' => 'Ahmed Hassan', 'email' => 'ahmed@pixelforge.com', 'company' => 'PixelForge'],
            ['name' => 'Sara Ibrahim', 'email' => 'sara@northbeam.com', 'company' => 'Northbeam Studio'],
            ['name' => 'Mohamed Ali', 'email' => 'mohamed@cloudnest.com', 'company' => 'CloudNest'],
            ['name' => 'Layla Farouk', 'email' => 'layla@flowbyte.com', 'company' => 'Flowbyte'],
            ['name' => 'Omar Youssef', 'email' => 'omar@techvault.com', 'company' => 'TechVault'],
        ];

        $employers = collect();
        foreach ($employerData as $data) {
            $employer = User::factory()->employer()->create([
                'name' => $data['name'],
                'email' => $data['email'],
            ]);

            EmployerProfile::factory()->create([
                'user_id' => $employer->id,
                'company_name' => $data['company'],
            ]);

            $employers->push($employer);
        }

        // Also create a generic test employer
        $testEmployer = User::factory()->employer()->create([
            'name' => 'Test Employer',
            'email' => 'employer@test.com',
        ]);
        EmployerProfile::factory()->create([
            'user_id' => $testEmployer->id,
            'company_name' => 'Test Company',
        ]);
        $employers->push($testEmployer);

        // ─── 4. Candidate Users + Profiles ───────────────────────────
        $candidateNames = [
            ['name' => 'Youssef Nabil', 'email' => 'youssef@example.com'],
            ['name' => 'Fatma Mahmoud', 'email' => 'fatma@example.com'],
            ['name' => 'Karim Tarek', 'email' => 'karim@example.com'],
            ['name' => 'Nour El-Din', 'email' => 'nour@example.com'],
            ['name' => 'Amira Khaled', 'email' => 'amira@example.com'],
            ['name' => 'Hassan Mostafa', 'email' => 'hassan@example.com'],
            ['name' => 'Mona Saeed', 'email' => 'monas@example.com'],
            ['name' => 'Tarek Zain', 'email' => 'tarek@example.com'],
            ['name' => 'Dina Ashraf', 'email' => 'dina@example.com'],
            ['name' => 'Ali Sherif', 'email' => 'alisherif@example.com'],
        ];

        $candidates = collect();
        foreach ($candidateNames as $data) {
            $candidate = User::factory()->candidate()->create([
                'name' => $data['name'],
                'email' => $data['email'],
            ]);

            EmployerCandidate::factory()->create([
                'user_id' => $candidate->id,
            ]);

            $candidates->push($candidate);
        }

        // Also create a generic test candidate
        $testCandidate = User::factory()->candidate()->create([
            'name' => 'Test Candidate',
            'email' => 'candidate@test.com',
        ]);
        EmployerCandidate::factory()->create([
            'user_id' => $testCandidate->id,
        ]);
        $candidates->push($testCandidate);

        // ─── 5. Job Listings ─────────────────────────────────────────
        $jobTitles = [
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
            'Senior React Developer',
            'Node.js Backend Engineer',
            'Python Developer',
            'iOS Developer',
            'Android Developer',
            'Database Administrator',
            'Systems Analyst',
            'Scrum Master',
            'Business Analyst',
            'Graphic Designer',
            'Content Strategist',
            'SEO Specialist',
            'HR Manager',
            'Financial Analyst',
            'Marketing Coordinator',
        ];

        $locations = [
            'Cairo, Egypt',
            'Alexandria, Egypt',
            'Giza, Egypt',
            'Remote',
            'Dubai, UAE',
            'Riyadh, Saudi Arabia',
            'Berlin, Germany',
            'London, UK',
        ];

        $descriptions = [
            'Join our team to build and scale modern web applications. You will collaborate closely with design and product teams to ship high-impact features for a global SaaS product. We value clean code, thoughtful architecture, and continuous improvement.',

            'We are looking for a passionate developer to support our backend services, write maintainable APIs, and work with senior engineers to deliver reliable platform features. Great opportunity for growth in a collaborative environment.',

            'Own product flows from wireframes to polished interfaces and collaborate closely with engineering to improve usability and conversion. You will be instrumental in shaping the user experience of our flagship product.',

            'Design intuitive web workflows and create reusable UI patterns that keep product quality consistent across teams. Work with cross-functional teams to translate complex requirements into elegant design solutions.',

            'Help us build and maintain our cloud infrastructure. You will work with modern tooling to ensure our platform is scalable, reliable, and secure. Experience with CI/CD pipelines and containerization is a plus.',

            'Drive data-informed decisions by building models and analyzing large datasets. You will work closely with product and engineering to uncover insights that shape our roadmap and improve user outcomes.',
        ];

        $jobSkills = [
            'Senior Frontend Engineer' => ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'JavaScript'],
            'Backend Developer' => ['Laravel', 'PHP', 'MySQL', 'REST API', 'Redis'],
            'Full-Stack Developer' => ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
            'UI/UX Designer' => ['Figma', 'Design Systems', 'Prototyping', 'UX Research'],
            'Product Designer' => ['Figma', 'Interaction Design', 'UX Research', 'Prototyping'],
            'DevOps Engineer' => ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
            'Data Scientist' => ['Python', 'Machine Learning', 'Pandas', 'TensorFlow', 'SQL'],
            'Mobile Developer' => ['React Native', 'Flutter', 'TypeScript', 'Dart', 'REST API'],
            'QA Engineer' => ['Selenium', 'Jest', 'Cypress', 'CI/CD', 'Agile'],
            'Project Manager' => ['Agile', 'Scrum', 'Jira', 'Confluence', 'Communication'],
            'Junior Backend Developer' => ['Laravel', 'MySQL', 'REST API', 'PHP', 'Git'],
            'Machine Learning Engineer' => ['Python', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Docker'],
            'Cloud Architect' => ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform'],
            'Security Analyst' => ['Cybersecurity', 'Network Security', 'SIEM', 'Python', 'Linux'],
            'Technical Writer' => ['Documentation', 'Markdown', 'API Documentation', 'Git', 'Confluence'],
            'Senior React Developer' => ['React', 'TypeScript', 'Redux', 'GraphQL', 'Jest'],
            'Node.js Backend Engineer' => ['Node.js', 'Express', 'MongoDB', 'TypeScript', 'Docker'],
            'Python Developer' => ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
            'iOS Developer' => ['Swift', 'SwiftUI', 'Xcode', 'REST API', 'Git'],
            'Android Developer' => ['Kotlin', 'Jetpack Compose', 'Android Studio', 'REST API', 'Git'],
            'Database Administrator' => ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Backup & Recovery'],
            'Systems Analyst' => ['Business Analysis', 'SQL', 'UML', 'Agile', 'Documentation'],
            'Scrum Master' => ['Scrum', 'Agile', 'Jira', 'Facilitation', 'Coaching'],
            'Business Analyst' => ['Business Analysis', 'SQL', 'Excel', 'Jira', 'Communication'],
            'Graphic Designer' => ['Adobe Photoshop', 'Illustrator', 'Figma', 'Typography', 'Branding'],
            'Content Strategist' => ['Content Writing', 'SEO', 'Analytics', 'WordPress', 'Social Media'],
            'SEO Specialist' => ['SEO', 'Google Analytics', 'Content Strategy', 'HTML', 'Keyword Research'],
            'HR Manager' => ['Recruitment', 'HRIS', 'Employee Relations', 'Compliance', 'Onboarding'],
            'Financial Analyst' => ['Excel', 'Financial Modeling', 'SQL', 'Python', 'Bloomberg'],
            'Marketing Coordinator' => ['Social Media', 'Google Analytics', 'Content Marketing', 'SEO', 'Email Marketing'],
        ];

        for ($i = 0; $i < 30; $i++) {
            $salaryMin = fake()->numberBetween(1000, 5000);
            $salaryMax = $salaryMin + fake()->numberBetween(500, 3000);
            $employer = $employers->random();
            $category = $categories->random();

            // 70% approved, 10% pending, 10% draft, 5% rejected, 5% closed
            $statusRoll = rand(1, 100);
            $status = match (true) {
                $statusRoll <= 70 => 'approved',
                $statusRoll <= 80 => 'pending',
                $statusRoll <= 90 => 'draft',
                $statusRoll <= 95 => 'rejected',
                default => 'closed',
            };

            $title = $jobTitles[$i];
            $skills = $jobSkills[$title] ?? fake()->randomElements([
                'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
                'Laravel', 'PHP', 'Docker', 'MySQL', 'Git',
            ], fake()->numberBetween(2, 5));

            JobListing::factory()->create([
                'employer_id' => $employer->id,
                'category_id' => $category->id,
                'title' => $title,
                'description' => $descriptions[array_rand($descriptions)],
                'location' => $locations[array_rand($locations)],
                'work_type' => fake()->randomElement(['remote', 'on_site']),
                'experience_level' => fake()->randomElement(['entry_level', 'mid_level', 'senior_level', 'executive_level']),
                'salary_min' => $salaryMin,
                'salary_max' => $salaryMax,
                'deadline' => fake()->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
                'skills' => $skills,
                'status' => $status,
            ]);
        }

        // ─── 6. Applications ─────────────────────────────────────────
        $approvedJobs = JobListing::where('status', 'approved')->get();

        foreach ($candidates as $candidate) {
            // Each candidate applies to 1-3 random approved jobs
            $jobsToApply = $approvedJobs->random(min(rand(1, 3), $approvedJobs->count()));

            foreach ($jobsToApply as $job) {
                // Avoid duplicate applications
                if (Application::where('job_id', $job->id)->where('candidate_id', $candidate->id)->exists()) {
                    continue;
                }

                Application::factory()->create([
                    'job_id' => $job->id,
                    'candidate_id' => $candidate->id,
                    'status' => fake()->randomElement(['pending', 'pending', 'approved', 'rejected']),
                ]);
            }
        }

        // ─── 7. Messages ─────────────────────────────────────────────
        $allUsers = User::all();

        for ($i = 0; $i < 25; $i++) {
            $sender = $allUsers->random();
            $receiver = $allUsers->where('id', '!==', $sender->id)->random();

            Message::factory()->create([
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
            ]);
        }

        // ─── 8. Notifications ────────────────────────────────────────
        for ($i = 0; $i < 30; $i++) {
            Notification::factory()->create([
                'user_id' => $allUsers->random()->id,
            ]);
        }

        // ─── Summary ─────────────────────────────────────────────────
        $this->command->info('');
        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('');
        $this->command->info('📋 Test Accounts (password: "password" for all):');
        $this->command->info('   👤 Admin:     admin@test.com');
        $this->command->info('   🏢 Employer:  employer@test.com');
        $this->command->info('   🎓 Candidate: candidate@test.com');
        $this->command->info('');
        $this->command->info('📊 Created:');
        $this->command->info('   ' . Category::count() . ' categories');
        $this->command->info('   ' . User::count() . ' users');
        $this->command->info('   ' . EmployerProfile::count() . ' employer profiles');
        $this->command->info('   ' . EmployerCandidate::count() . ' candidate profiles');
        $this->command->info('   ' . JobListing::count() . ' job listings (' . JobListing::where('status', 'approved')->count() . ' approved)');
        $this->command->info('   ' . Application::count() . ' applications');
        $this->command->info('   ' . Message::count() . ' messages');
        $this->command->info('   ' . Notification::count() . ' notifications');
    }
}
