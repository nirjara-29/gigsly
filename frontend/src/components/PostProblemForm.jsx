import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Upload, X } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "@clerk/clerk-react";

export function PostProblemForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getToken } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {

    const token = await getToken();   // 👈 fetch Clerk token here
    console.log("🔑 Clerk Token:", token); // 👈 copy this from browser console for Postman

   const fd = new FormData();
fd.append("title", formData.title);
fd.append("description", formData.description);
fd.append("budget", formData.budget);
fd.append("deadline", formData.deadline);

files.forEach(f => fd.append("files", f)); // IMPORTANT


    // 1. Ask backend to create Razorpay order & pending problem
    const { order, problem } = await api.createProblemEscrow(fd, getToken);


    // 2. Launch Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "GigSly",
      description: "Escrow for problem",
      order_id: order.id,
      handler: async function (response) {
        await api.verifyProblemPayment({
          razorpay_order_id: order.id,
          razorpay_payment_id: response.razorpay_payment_id,
        }, getToken);

        alert("✅ Payment successful, problem is live!");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("❌ Error posting problem:", error);
    alert("Error posting problem. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Card className="w-full bg-gradient-to-br from-gray-100 via-white to-gray-100 border border-gray-200 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 tracking-wide">
          Post a Problem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Problem Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Describe your problem briefly"
                required
                className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-gray-700">
                Budget ($)
              </Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="1000"
                required
                className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed requirements and specifications..."
              rows={4}
              required
              className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-gray-700">
              Deadline
            </Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleInputChange}
              required
              className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Attachments</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors bg-gray-50">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload files or drag and drop
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Problem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
