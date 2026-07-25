import { Phone, Mail, MessageCircle } from "lucide-react";

interface TeamMemberCardProps {
  name: string;
  position: string;
  bio?: string | null;
  image?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
}

export function TeamMemberCard({
  name,
  position,
  bio,
  image,
  phone,
  email,
  whatsapp,
}: TeamMemberCardProps) {
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="font-heading font-semibold text-lg mb-1">{name}</h3>
        <p className="text-secondary font-medium text-sm mb-3">{position}</p>
        {bio && <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{bio}</p>}

        {(phone || whatsapp || email) && (
          <div className="flex gap-2">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                aria-label={`Call ${name}`}
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-emerald-600 text-primary-foreground rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                aria-label={`WhatsApp ${name}`}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                aria-label={`Email ${name}`}
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}