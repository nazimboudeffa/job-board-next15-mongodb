import { formatMoney, relativeDate } from "@/lib/helpers";
import { Banknote, Briefcase, Clock, MapPin } from "lucide-react";
import Badge from "./Badge";
import Job from "@/lib/types/job";

interface JobListItemProps {
  job: Job;
}

export default function JobListItem({
  job: {
    _id,
    title,
    skills,
    company,
    type,
    location,
    salaryMin,
    salaryMax,
    createdAt,
  },
}: Readonly<JobListItemProps>) {
  return (
    <article id={_id.toString()} className="flex flex-col sm:flex-row gap-3 rounded-lg border p-5 hover:bg-muted/60">
      <div className="flex-grow space-y-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-muted-foreground">{company}</p>
        </div>
        <div className="text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin size={16} className="shrink-0" />
            {location || "Remote"}
          </p>
          <p className="flex items-center gap-1.5">
            <Briefcase size={16} className="shrink-0" />
            {type}
          </p>
          <p className="flex items-center gap-1.5">
            <Banknote size={16} className="shrink-0" />
            {formatMoney(salaryMin)} - {formatMoney(salaryMax)}
          </p>
          <div className="flex flex-wrap items-center gap-1">
            {skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
        <Badge variant="outline">Remote</Badge>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock size={16} />
          {relativeDate(createdAt)}
        </span>
      </div>
    </article>
  );
}
