import React, { useEffect } from "react";
import "../Styles/Postposter.css";
import { Dot } from "lucide-react";
export default function Postposter(props) {
  useEffect(() => {
    console.log(props);
  }, [props]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (0-based index) and pad with zero
    const year = date.getFullYear(); // Get the full year

    return `${day}-${month}-${year}`; // Format as "dd-mm-yyyy"
  };
  return (
    <>
      <div className="poster">
        <h3 className="header-poster">{props.blogData.poster_title}</h3>
        <h4 className="desc-poster">{props.blogData.poster_description}</h4>
        <div className="footer-poster">
          <h3 className="created-or-uploaded">
            {props.blogData.uploded_at
              ? formatDate(props.blogData.uploded_at)
              : formatDate(props.blogData.created_at)}{" "}
            Uploded on
          </h3>
          <Dot color="#676767" size={20} />
          <h3 className="totalword">
            {props.blogData.poster_title.length +
              props.blogData.poster_description.length}{" "}
            words
          </h3>
        </div>
      </div>
    </>
  );
}
