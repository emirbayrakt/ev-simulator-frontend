function HeatMapTitle({ title }: { title: string }) {
  return (
    <div className="flex mb-4">
      <h3 className="text-sm font-semibold border border-purple-600 rounded-lg px-4 py-2">
        {title}
      </h3>
    </div>
  );
}

export default HeatMapTitle;
