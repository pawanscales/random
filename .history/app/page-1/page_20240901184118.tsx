import dynamic from 'next/dynamic';

const MyComponent = dynamic(() => import('@/callbutton/CallButton'), {
  loading: () => <p>Loading...</p>,
  ssr: false, 
});

export default function Page() {
  return (
    <div>
      <MyComponent />
    </div>
  );
}