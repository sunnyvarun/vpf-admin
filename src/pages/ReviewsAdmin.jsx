import { useEffect, useState } from "react";
import { fetchReviewsAdmin, approveReview, deleteReview } from "../api";

export default function ReviewsAdmin(){
  const [list,setList] = useState([]);
  async function load(){ setList(await fetchReviewsAdmin()); }
  useEffect(()=>{load()},[]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reviews</h1>
      <div className="bg-[#020617] p-4 rounded">
        <table className="w-full text-sm">
          <thead><tr><th>Author</th><th>Text</th><th>Rating</th><th>Approved</th><th></th></tr></thead>
          <tbody>
            {list.map(r => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="py-2">{r.author_name}</td>
                <td className="py-2">{r.text}</td>
                <td className="py-2">{r.rating}</td>
                <td className="py-2">{r.approved ? 'Yes' : 'No'}</td>
                <td className="py-2 text-right">
                  {!r.approved && <button onClick={()=>approveReview(r.id,1).then(load)} className="text-xs text-green-300 mr-3">Approve</button>}
                  <button onClick={()=>deleteReview(r.id).then(load)} className="text-xs text-red-300">Delete</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-white/60">No reviews.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
