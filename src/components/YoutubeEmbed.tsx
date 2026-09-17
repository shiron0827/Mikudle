interface Props {
    embedId: string;
}

const YoutubeEmbed = ({ embedId }: Props) => (
  <div style={{
    position: "relative",
    paddingBottom: "56.25%", /* 16:9 Aspect Ratio */
    paddingTop: "25px",
    height: 0,
    overflow: "hidden"
  }}>
    <iframe
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        height: "50%"
      }}
      src={`https://www.youtube.com/embed/${embedId}`}
      title="Embedded YouTube Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  </div>
);

export default YoutubeEmbed;