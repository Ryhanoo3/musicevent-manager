
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border rounded-xl hover:scale-[1.02] group animate-slide-up">
      <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">{event.name.charAt(0)}</div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold truncate">{event.name}</CardTitle>
          {isUpcoming && (
            <Badge className="bg-green-500 hover:bg-green-600">Upcoming</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={16} className="text-gray-500" />
          <span>{formatDate(event.date)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={16} className="text-gray-500" />
          <span>{event.duration}</span>
        </div>
        
        <div className="flex items-start gap-2 text-gray-700">
          <MapPin size={16} className="text-gray-500 mt-0.5" />
          <div className="flex flex-wrap gap-1">
            {event.rooms.map((room, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
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
