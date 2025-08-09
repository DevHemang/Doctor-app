import { Suspense } from 'react';
import Main from './components/Main';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Main />
    </Suspense>
  );
}
