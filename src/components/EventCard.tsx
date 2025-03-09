
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface EventData {
  id: string;
  name: string;
  date: string;
  duration: string;
  rooms: string[];
}

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-none bg-event-card text-event-cardText hover:bg-event-cardHover animate-slide-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold truncate">{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-[80px_1fr] items-center">
          <span className="text-sm opacity-80">Event ID:</span>
          <span className="font-medium truncate">{event.id}</span>
        </div>
        
        <div className="grid grid-cols-[80px_1fr] items-center">
          <span className="text-sm opacity-80">Date:</span>
          <span className="font-medium">{event.date}</span>
        </div>
        
        <div className="grid grid-cols-[80px_1fr] items-center">
          <span className="text-sm opacity-80">Duration:</span>
          <span className="font-medium">{event.duration}</span>
        </div>
        
        <div className="grid grid-cols-[80px_1fr] items-center">
          <span className="text-sm opacity-80">Rooms:</span>
          <div className="flex flex-wrap gap-1">
            {event.rooms.map((room, index) => (
              <Badge key={index} variant="outline" className="bg-white/20 text-white border-white/10">
                {room}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
