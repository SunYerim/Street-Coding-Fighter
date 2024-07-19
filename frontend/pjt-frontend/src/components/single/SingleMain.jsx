import EpisodeList from "./episode-list/EpisodeList.jsx";
import Header from "../sanghyeon/components/Header.jsx";

export default function SingleMain() {
  return (
    <div>
      <Header />
      <h1>Tutorials</h1>
      <EpisodeList />
      <EpisodeList />
      <EpisodeList />
    </div>
  );
}
