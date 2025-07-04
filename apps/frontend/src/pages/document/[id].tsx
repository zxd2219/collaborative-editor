import { useParams } from 'react-router-dom';

export default function DocumentDetail() {
  const { id } = useParams();
  return <div>document {id}</div>;
}
