// import { useEffect, useState } from 'react';

// import { fetchAdminBerita, fetchPublicBerita } from '../../../berita/api/beritaApi';
// import type { BeritaItem } from '../../../berita/types/berita';

// type BeritaState = {
//   data: BeritaItem[];
//   isLoading: boolean;
// };

// const initialState: BeritaState = {
//   data: [],
//   isLoading: true,
// };

// const useBeritaLoader = (loader: () => Promise<BeritaItem[]>) => {
//   const [state, setState] = useState(initialState);

//   useEffect(() => {
//     let isMounted = true;

//     loader()
//       .then((data) => {
//         if (isMounted) {
//           setState({ data, isLoading: false });
//         }
//       })
//       .catch(() => {
//         if (isMounted) {
//           setState({ data: [], isLoading: false });
//         }
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, [loader]);

//   return state;
// };

// export const usePublicBerita = () => useBeritaLoader(fetchPublicBerita);

// export const useAdminBerita = () => useBeritaLoader(fetchAdminBerita);

