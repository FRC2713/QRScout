import { useQRScoutState } from '@/store/store';
import { Heart } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  const teamNumber = useQRScoutState(state => state.formData.teamNumber);
  return (
    <footer>
      <div className="mt-8 flex flex-col items-center justify-center p-2 gap-2">
        {teamNumber == 9496 && (
          <>
            <span className="text-2xl text-primary font-lynk">
              LYNK 9496
            </span>
            <Heart className="text-primary size-8 fill-primary" />
            <span className="text-2xl text-primary font-lynk">
              Our Scouters!
            </span>
          </>
        )}
      </div>
    </footer>
  );
}
