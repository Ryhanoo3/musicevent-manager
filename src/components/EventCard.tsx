
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

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
  // Function to format date properly
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  // Determine if event is upcoming
  const isUpcoming = new Date(event.date) > new Date();
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border border-scheme-accent/20 rounded-xl hover:scale-[1.02] group animate-slide-up bg-scheme-dominant/80">
      <div className="h-40 bg-gradient-to-r from-scheme-secondary to-scheme-secondary/80 flex items-center justify-center">
        <div className="text-scheme-dominant text-2xl font-bold">{event.name.charAt(0)}</div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold truncate text-scheme-accent">{event.name}</CardTitle>
          {isUpcoming && (
            <Badge className="bg-scheme-secondary text-scheme-dominant hover:bg-scheme-secondary/90">Upcoming</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-scheme-accent/90">
          <Calendar size={16} className="text-scheme-secondary" />
          <span>{formatDate(event.date)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-scheme-accent/90">
          <Clock size={16} className="text-scheme-secondary" />
          <span>{event.duration}</span>
        </div>
        
        <div className="flex items-start gap-2 text-scheme-accent/90">
          <MapPin size={16} className="text-scheme-secondary mt-0.5" />
          <div className="flex flex-wrap gap-1">
            {event.rooms.map((room, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-scheme-accent/10 text-scheme-accent border-scheme-accent/20 hover:bg-scheme-accent/20"
              >
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
