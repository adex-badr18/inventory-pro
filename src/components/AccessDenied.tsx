import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { UserRole, getRoleDisplayName } from '../utils/auth';

interface AccessDeniedProps {
  userRole?: UserRole;
  onBack?: () => void;
}

export function AccessDenied({ userRole, onBack }: AccessDeniedProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <ShieldAlert className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl text-gray-900">Access Denied</h2>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
            {userRole && (
              <p className="text-sm text-gray-500">
                Your current role: <strong>{getRoleDisplayName(userRole)}</strong>
              </p>
            )}
          </div>

          <div className="pt-4">
            {onBack ? (
              <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            ) : (
              <Button onClick={() => window.history.back()} className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
          </div>

          <div className="pt-4 border-t text-sm text-gray-500">
            If you believe you should have access to this page, please contact your administrator.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
