import SingleResto from "@/components/Restaurants/SingleResto";
import Card from "@/Ui/Card";

export default async function RestoDetails({ params }) {
  const restoId = Number(params.restoId); // تحويل السلسلة إلى رقم

  return (
    <div>
      <Card className="mx-auto my-10">
        <SingleResto restoId={restoId} />
      </Card>
    </div>
  );
}
