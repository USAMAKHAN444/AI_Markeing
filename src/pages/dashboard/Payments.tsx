import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Trash2,
  Plus,
  Check,
  FileText,
  Download,
  DollarSign,
  Calendar,
  Info,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Payments: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'pm_1',
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      isDefault: true
    }
  ]);
  
  const [invoices, setInvoices] = useState([
    {
      id: 'inv_1',
      amount: 150,
      date: '2023-06-15',
      status: 'paid',
      description: 'Summer Sale Promotion Campaign'
    },
    {
      id: 'inv_2',
      amount: 300,
      date: '2023-06-05',
      status: 'paid',
      description: 'Product Launch Campaign'
    },
    {
      id: 'inv_3',
      amount: 200,
      date: '2023-05-20',
      status: 'paid',
      description: 'Brand Awareness Campaign'
    }
  ]);
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardData, setNewCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCardData({
      ...newCardData,
      [name]: value
    });
  };
  
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newCardData.cardNumber || !newCardData.cardHolder || !newCardData.expiryDate || !newCardData.cvv) {
      toast({
        title: 'Missing information',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, make API call to add card
    setTimeout(() => {
      const newCard = {
        id: `pm_${Math.random().toString(36).substr(2, 9)}`,
        type: 'card',
        brand: 'mastercard',
        last4: newCardData.cardNumber.slice(-4),
        expMonth: parseInt(newCardData.expiryDate.split('/')[0]),
        expYear: parseInt(`20${newCardData.expiryDate.split('/')[1]}`),
        isDefault: paymentMethods.length === 0
      };
      
      setPaymentMethods([...paymentMethods, newCard]);
      
      toast({
        title: 'Card added',
        description: 'Your payment method has been added successfully',
      });
      
      setNewCardData({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
      });
      
      setIsAddingCard(false);
      setIsSubmitting(false);
    }, 1500);
  };
  
  const handleRemoveCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter(card => card.id !== id));
    
    toast({
      title: 'Card removed',
      description: 'Your payment method has been removed',
    });
  };
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(card => ({
      ...card,
      isDefault: card.id === id
    })));
    
    toast({
      title: 'Default payment method updated',
      description: 'Your default payment method has been updated',
    });
  };
  
  const getCardIcon = (brand: string) => {
    return (
      <div className={`p-2 rounded-md ${brand === 'visa' ? 'bg-blue-100' : 'bg-red-100'}`}>
        <CreditCard className={`h-5 w-5 ${brand === 'visa' ? 'text-blue-700' : 'text-red-700'}`} />
      </div>
    );
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-700">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-700">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };
  
  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substr(0, 5);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Payments & Billing</h1>
        
        <Tabs defaultValue="payment-methods">
          <TabsList className="mb-6">
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="billing-history">Billing History</TabsTrigger>
          </TabsList>
          
          {/* Payment Methods Tab */}
          <TabsContent value="payment-methods">
            <Card>
              <CardHeader>
                <CardTitle>Your Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing preferences
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Existing payment methods */}
                {paymentMethods.length > 0 ? (
                  <div className="space-y-4">
                    {paymentMethods.map((card) => (
                      <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getCardIcon(card.brand)}
                          <div>
                            <p className="font-medium">
                              {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} •••• {card.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires {card.expMonth}/{card.expYear}
                            </p>
                          </div>
                          {card.isDefault && (
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {!card.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefault(card.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCard(card.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <p className="text-gray-500">No payment methods found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add a payment method to create campaigns
                    </p>
                  </div>
                )}
                
                {/* Add new card form */}
                {isAddingCard ? (
                  <div className="mt-6 border rounded-lg p-4">
                    <form onSubmit={handleAddCard}>
                      <h3 className="font-medium mb-4">Add New Payment Method</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formatCardNumber(newCardData.cardNumber)}
                            onChange={handleInputChange}
                            maxLength={19}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardHolder">Cardholder Name</Label>
                          <Input
                            id="cardHolder"
                            name="cardHolder"
                            placeholder="John Doe"
                            value={newCardData.cardHolder}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={formatExpiryDate(newCardData.expiryDate)}
                              onChange={handleInputChange}
                              maxLength={5}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              value={newCardData.cvv}
                              onChange={handleInputChange}
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex mt-6 gap-2 justify-end">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsAddingCard(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Save Card
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setIsAddingCard(true)} 
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                )}
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-700 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-blue-800">Payment Security</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your payment information is securely stored and processed. We never store your full card details on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Billing History Tab */}
          <TabsContent value="billing-history">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View and download your past invoices
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {invoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs uppercase bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left">Date</th>
                          <th className="px-6 py-3 text-left">Description</th>
                          <th className="px-6 py-3 text-right">Amount</th>
                          <th className="px-6 py-3 text-left">Status</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(invoice.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              {invoice.description}
                            </td>
                            <td className="px-6 py-4 text-right">
                              ${invoice.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(invoice.status)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                PDF
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No billing history yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Your invoices will appear here once you've made a payment
                    </p>
                  </div>
                )}
                
                <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-700 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-amber-800">Need help with billing?</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        If you have any questions about your billing or payments, please contact our support team at <a href="mailto:support@adalchemy.com" className="underline">support@adalchemy.com</a>.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Billing Summary Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Billing Summary</CardTitle>
                <CardDescription>
                  Overview of your current billing period
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Billing Cycle */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-gray-700 mr-2" />
                        <h4 className="font-medium">Billing Cycle</h4>
                      </div>
                      <p className="text-sm text-gray-500">
                        June 1 - June 30, 2023
                      </p>
                    </div>
                    
                    {/* Current Usage */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-5 w-5 text-gray-700 mr-2" />
                        <h4 className="font-medium">Current Usage</h4>
                      </div>
                      <p className="text-sm text-gray-500">
                        $650.00 (3 campaigns)
                      </p>
                    </div>
                    
                    {/* Next Payment */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CreditCard className="h-5 w-5 text-gray-700 mr-2" />
                        <h4 className="font-medium">Next Payment</h4>
                      </div>
                      <p className="text-sm text-gray-500">
                        July 1, 2023
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-3">Payment Breakdown</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Summer Sale Promotion</span>
                        <span className="text-sm font-medium">$150.00</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Product Launch</span>
                        <span className="text-sm font-medium">$300.00</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Brand Awareness</span>
                        <span className="text-sm font-medium">$200.00</span>
                      </div>
                      
                      <div className="border-t pt-2 mt-2 flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">$650.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
