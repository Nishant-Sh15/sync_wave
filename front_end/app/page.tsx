import AnimatedBackground from '@/components/landing/animated-background';
import JoinCreateCard from '@/components/landing/join-create-card';

export const metadata = {
  title: 'Music Room - Listen Together',
  description: 'Sync music with friends in real-time',
};

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {/* <AnimatedBackground /> */}
      <div className="w-full max-w-md">
        <JoinCreateCard />
      </div>
    </main>
  );
}
