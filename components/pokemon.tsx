'use client';

import cx from 'classnames';
import { useEffect, useState } from 'react';




export function PokemonCard({
   pokemonInfo 
}: {
    pokemonInfo: any
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div>{pokemonInfo}</div>
    );
}
