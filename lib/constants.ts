export interface EventItem {
  title: string;
  image: string;
  slug?: string;
  location?: string;
  date?: string;
  time?: string;
}

export const events: EventItem[] = [
  {
    title: 'React Summit 2026',
    image: '/images/event1.png',
    slug: 'react-summit-2026',
    location: 'Amsterdam, Netherlands',
    date: '2026-04-22',
    time: '09:00'
  },
  {
    title: 'Google I/O 2026',
    image: '/images/event2.png',
    slug: 'google-io-2026',
    location: 'Mountain View, CA, USA',
    date: '2026-05-19',
    time: '10:00'
  },
  {
    title: 'Microsoft Build 2026',
    image: '/images/event3.png',
    slug: 'microsoft-build-2026',
    location: 'Seattle, WA, USA',
    date: '2026-05-26',
    time: '09:30'
  },
  {
    title: 'KubeCon + CloudNativeCon 2026',
    image: '/images/event4.png',
    slug: 'kubecon-cloudnative-2026',
    location: 'Valencia, Spain',
    date: '2026-03-10',
    time: '09:00'
  },
  {
    title: 'ETHDenver 2026',
    image: '/images/event5.png',
    slug: 'ethdenver-2026',
    location: 'Denver, CO, USA',
    date: '2026-02-14',
    time: '11:00'
  },
  {
    title: 'HackMIT 2026',
    image: '/images/event6.png',
    slug: 'hackmit-2026',
    location: 'Cambridge, MA, USA',
    date: '2026-03-07',
    time: '18:00'
  },
  {
    title: 'JSConf US 2026',
    image: '/images/event-full.png',
    slug: 'jsconf-us-2026',
    location: 'New York, NY, USA',
    date: '2026-06-12',
    time: '09:00'
  }
];

export default events;
