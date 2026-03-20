"use client";

import { useEffect, useState } from "react";

interface Voicemail {
  id: string;
  call_sid: string;
  from_number: string;
  to_number: string;
  recording_url: string;
  recording_sid: string;
  duration_seconds: number;
  transcription: string | null;
  status: string;
  created_at: string;
}

interface SmsMessage {
  id: string;
  message_sid: string;
  from_number: string;
  to_number: string;
  body: string;
  num_media: number;
  media_urls: string[];
  status: string;
  created_at: string;
}

type Tab = "all" | "voicemails" | "sms";

export default function MessagesPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [voicemails, setVoicemails] = useState<Voicemail[]>([]);
  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      try {
        const res = await fetch(`/api/twilio/messages?type=${tab}`);
        const data = await res.json();
        if (data.voicemails) setVoicemails(data.voicemails);
        if (data.sms_messages) setSmsMessages(data.sms_messages);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [tab]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-amber-400">Messages</h1>
        <p className="text-gray-400 text-sm mt-1">
          Voicemails & SMS from your Twilio number
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4">
        {(["all", "voicemails", "sms"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-amber-500/20 text-amber-400"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {t === "sms" ? "SMS" : t === "all" ? "All Messages" : "Voicemails"}
          </button>
        ))}
      </div>

      <main className="px-6 py-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-800/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Voicemails */}
            {(tab === "all" || tab === "voicemails") &&
              voicemails.map((vm) => (
                <div
                  key={vm.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-sm font-medium text-amber-400">
                        Voicemail
                      </span>
                      {vm.status === "new" && (
                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(vm.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">
                    <span className="text-gray-500">From:</span>{" "}
                    {vm.from_number}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    Duration: {formatDuration(vm.duration_seconds)}
                  </p>
                  {vm.transcription && (
                    <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3 mb-2 italic">
                      &ldquo;{vm.transcription}&rdquo;
                    </p>
                  )}
                  <audio
                    controls
                    className="w-full h-8"
                    src={`${vm.recording_url}.mp3`}
                  >
                    <track kind="captions" />
                  </audio>
                </div>
              ))}

            {/* SMS Messages */}
            {(tab === "all" || tab === "sms") &&
              smsMessages.map((sms) => (
                <div
                  key={sms.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-sm font-medium text-blue-400">
                        SMS
                      </span>
                      {sms.status === "unread" && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                          Unread
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(sms.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">
                    <span className="text-gray-500">From:</span>{" "}
                    {sms.from_number}
                  </p>
                  <p className="text-sm text-gray-200 mt-2">{sms.body}</p>
                  {sms.num_media > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {sms.media_urls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 underline"
                        >
                          Attachment {i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            {/* Empty states */}
            {!loading &&
              voicemails.length === 0 &&
              smsMessages.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg mb-2">No messages yet</p>
                  <p className="text-sm">
                    Configure your Twilio number&apos;s webhooks to start
                    receiving voicemails and SMS.
                  </p>
                </div>
              )}
          </>
        )}
      </main>
    </div>
  );
}
