
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Reservation = () => {
  const [step, setStep] = useState(1);
  const [reservationData, setReservationData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    notes: ""
  });
  const [confirmationId, setConfirmationId] = useState("");
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservationData.name || !reservationData.email || !reservationData.phone || 
        !reservationData.date || !reservationData.time || !reservationData.guests) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Generate confirmation ID
    const id = "RES" + Math.random().toString(36).substr(2, 9).toUpperCase();
    setConfirmationId(id);
    setStep(2);

    // Here you would normally send data to your database
    console.log("Reservation data:", { ...reservationData, confirmationId: id });
    
    toast({
      title: "Reservation Confirmed!",
      description: `Your table has been reserved for ${reservationData.date} at ${reservationData.time}`,
    });
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center animate-scale-in">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Reservation Confirmed!</h1>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Confirmation ID</p>
              <p className="text-xl font-mono font-bold text-gray-900">{confirmationId}</p>
            </div>
            <div className="space-y-2 text-left">
              <p><span className="font-semibold">Name:</span> {reservationData.name}</p>
              <p><span className="font-semibold">Date:</span> {reservationData.date}</p>
              <p><span className="font-semibold">Time:</span> {reservationData.time}</p>
              <p><span className="font-semibold">Guests:</span> {reservationData.guests}</p>
            </div>
            <Link to="/" className="block mt-6">
              <Button className="w-full">Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="flex items-center text-gray-600 hover:text-orange-600 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Reservation</h1>
            <p className="text-gray-600">Reserve your table at Savory Delights</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                Reservation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={reservationData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={reservationData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={reservationData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={reservationData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time *</Label>
                    <Select onValueChange={(value) => handleInputChange("time", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="17:30">5:30 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                        <SelectItem value="18:30">6:30 PM</SelectItem>
                        <SelectItem value="19:00">7:00 PM</SelectItem>
                        <SelectItem value="19:30">7:30 PM</SelectItem>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="20:30">8:30 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="guests">Guests *</Label>
                    <Select onValueChange={(value) => handleInputChange("guests", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="# of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Guest" : "Guests"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Special Requests (Optional)</Label>
                  <Input
                    id="notes"
                    value={reservationData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any special requests or dietary restrictions"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                >
                  Confirm Reservation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
