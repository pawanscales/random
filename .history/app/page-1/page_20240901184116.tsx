import dynamic from 'next/dynamic';

const MyComponent = dynamic(() => import('@/callbutton/CallButton'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Optional: Disable server-side rendering for this component
});

export default function Page() {
  return (
    <div>
      <MyComponent />
    </div>
  );
}