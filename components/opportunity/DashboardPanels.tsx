import type {Contact, Document, Event, Issue, LatestChange, StateSnapshot} from "@/lib/schemas";
import {SeverityTag, StatusBadge} from "@/components/common/Badges";
import {MetricProvenance} from "@/components/common/Provenance";

export function LatestChangesPanel({changes}: {changes: LatestChange[]}) {
  return (
    <section className="card module" id="changes">
      <span className="module-kicker">Since last review</span>
      <h2 className="module-title">Latest changes</h2>
      <ol className="change-list">
        {changes.map((change, index) => (
          <li key={`${change.type}-${index}`}>
            <div>
              <span className="numeric">{change.timestamp?.slice(0, 10) ?? "Current"}</span>
              <SeverityTag value={change.severity} />
            </div>
            <strong>{change.description}</strong>
            <p>{change.impact}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ClaimsLedger({state}: {state: StateSnapshot}) {
  const arr = state.key_metrics.arr;
  const nrr = state.key_metrics.nrr;
  const ebitda = state.key_metrics.ebitda_margin;

  return (
    <section className="card module" id="claims">
      <span className="module-kicker">Claims ledger</span>
      <h2 className="module-title">Claims, support and review state</h2>
      <div className="claims-ledger">
        {arr ? (
          <article className="claim-row">
            <blockquote>ARR is currently {arr.value}.</blockquote>
            <div className="claim-support">
              <span className="tag tag-high">Source-backed</span>
              <MetricProvenance metric={arr} />
              {arr.conflicts.map((conflict, index) => (
                <span className="tag tag-unsupported" key={index}>
                  Conflict: {conflict.value}
                </span>
              ))}
            </div>
          </article>
        ) : null}
        {nrr ? (
          <article className="claim-row">
            <blockquote>NRR is reported at {nrr.value}, but cohort evidence is still missing.</blockquote>
            <div className="claim-support">
              <span className="tag tag-medium">Needs review</span>
              <MetricProvenance metric={nrr} />
            </div>
          </article>
        ) : null}
        {ebitda ? (
          <article className="claim-row">
            <blockquote>EBITDA margin remains unsupported for memo purposes.</blockquote>
            <div className="claim-support">
              <MetricProvenance metric={ebitda} />
              <span className="tag tag-unsupported">Unsupported add-backs</span>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}

export function OpenIssuesTable({issues}: {issues: Issue[]}) {
  return (
    <section className="card module" id="issues">
      <span className="module-kicker">Diligence</span>
      <h2 className="module-title">Open issues</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Issue</th>
              <th scope="col">Severity</th>
              <th scope="col">Evidence</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>
                  <strong>{issue.title}</strong>
                  <p>{issue.description}</p>
                </td>
                <td>
                  <SeverityTag value={issue.severity} />
                </td>
                <td>
                  {issue.evidence.map((id) => (
                    <a className="tag source-link" href={`#source-${id}`} key={id}>
                      {id}
                    </a>
                  ))}
                </td>
                <td>{issue.recommended_action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function DocumentChecklist({documents}: {documents: Document[]}) {
  return (
    <section className="card module" id="materials">
      <span className="module-kicker">Artefacts</span>
      <h2 className="module-title">Document checklist</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Artefact</th>
              <th scope="col">Status</th>
              <th scope="col">Reason or file</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} id={`source-${doc.id}`}>
                <td>{doc.artefact_type.replaceAll("_", " ")}</td>
                <td>
                  <StatusBadge value={doc.status} />
                </td>
                <td>{doc.standardised_filename ?? doc.notes[0] ?? "No detail"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
export function SuggestedActions({state}:{state:StateSnapshot}){return <section className="card module"><span className="module-kicker">Next</span><h2 className="module-title">Suggested actions</h2><ol className="action-list">{state.next_actions.map((action,index)=><li key={action}><span className="numeric">0{index+1}</span>{action}</li>)}</ol></section>}
export function Contacts({contacts}:{contacts:Contact[]}){return <section className="card module"><span className="module-kicker">People</span><h2 className="module-title">Key contacts</h2><ul className="contact-list">{contacts.map(contact=><li key={contact.id}><div><strong>{contact.name}</strong><span>{contact.role} · {contact.organisation}</span></div><time>{contact.last_interaction}</time></li>)}</ul><div className="upcoming"><strong>Upcoming</strong><span>CFO diligence call · <time>24 Jun 2026, 10:30</time></span></div></section>}
export function TimelineAudit({events}:{events:Event[]}){return <><section className="card module"><span className="module-kicker">Chronology</span><h2 className="module-title">Timeline</h2><ol className="timeline">{events.map(event=><li key={event.id}><time>{event.timestamp.slice(0,10)}</time><strong>{event.description}</strong><span>{event.actor}</span></li>)}</ol></section><section className="card module"><span className="module-kicker">Integrity record</span><h2 className="module-title">Audit trail</h2><div className="table-scroll"><table><thead><tr><th scope="col">When</th><th scope="col">Actor</th><th scope="col">Type</th><th scope="col">Sources</th></tr></thead><tbody>{events.toReversed().map(event=><tr key={event.id}><td className="numeric">{event.timestamp.replace("T"," ").slice(0,16)}</td><td>{event.actor}</td><td>{event.type.replaceAll("_"," ")}</td><td>{event.source_ids.map(id=><a className="tag source-link" href={`#source-${id}`} key={id}>{id}</a>)}</td></tr>)}</tbody></table></div></section></>}
