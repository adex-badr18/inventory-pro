import { Bell, Search, ChevronDown, Building2, ArrowRightLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { User, hasPermission, getRoleDisplayName } from '../utils/auth';

interface TopNavigationProps {
  currentBranch: string;
  onBranchChange: (branch: string) => void;
  onOpenStockTransfer?: () => void;
  user: User | null;
}

export function TopNavigation({ currentBranch, onBranchChange, onOpenStockTransfer, user }: TopNavigationProps) {
  const branches = [
    { id: 'main', name: 'Main Branch', location: 'Downtown' },
    { id: 'north', name: 'North Branch', location: 'North District' },
    { id: 'south', name: 'South Branch', location: 'South Mall' },
    { id: 'west', name: 'West Branch', location: 'West Plaza' }
  ];

  const currentBranchData = branches.find(b => b.id === currentBranch) || branches[0];

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section - Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <Input 
            placeholder="Search inventory, branches, reports..." 
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Center Section - Branch Selector */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 h-10">
              <Building2 className="h-4 w-4 text-blue-600" />
              <div className="text-left">
                <div className="text-sm">{currentBranchData.name}</div>
                <div className="text-xs text-gray-500">{currentBranchData.location}</div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            {branches.map((branch) => (
              <DropdownMenuItem
                key={branch.id}
                onClick={() => onBranchChange(branch.id)}
                className={currentBranch === branch.id ? "bg-blue-50" : ""}
              >
                <div className="flex items-center gap-3 w-full">
                  <Building2 className="h-4 w-4" />
                  <div>
                    <div className="text-sm">{branch.name}</div>
                    <div className="text-xs text-gray-500">{branch.location}</div>
                  </div>
                  {currentBranch === branch.id && (
                    <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-blue-600">
              <Building2 className="h-4 w-4 mr-2" />
              Manage Branches
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center gap-4">
        {hasPermission(user, 'transferStock') && onOpenStockTransfer && (
          <Button 
            variant="outline" 
            className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
            onClick={onOpenStockTransfer}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Transfer Stock</span>
          </Button>
        )}
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            3
          </Badge>
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div className="text-gray-900">{user?.name || 'User'}</div>
            <div className="text-xs text-gray-500">
              {user ? getRoleDisplayName(user.role) : 'Guest'}
              {user?.branchName && ` • ${user.branchName}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}