import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Users, BookOpen, Brain, Calendar, TrendingUp, AlertCircle, Video } from "lucide-react";
import { ZOOM_MEETING_URL } from "@/config/zoom";

export default function Dashboard() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: coach } = trpc.coaches.getProfile.useQuery();
  const { data: clients } = trpc.clients.list.useQuery();

  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalSessions: 0,
    recentInsights: 0,
  });

  useEffect(() => {
    if (clients) {
      setStats(prev => ({
        ...prev,
        totalClients: clients.length,
        activeClients: clients.filter(c => c.status === "active").length,
      }));
    }
  }, [clients]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = "/api/oauth/login"}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purposeful Live Coaching</h1>
              <p className="text-sm text-gray-600 mt-1">Empowering emotional resilience through data-driven insights</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="default" 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open(ZOOM_MEETING_URL, '_blank')}
              >
                <Video className="h-4 w-4 mr-2" />
                Start Video Session
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                <p className="text-xs text-gray-500">{coach ? "Coach" : "User"}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/api/oauth/logout"}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!coach ? (
          <Card className="mb-8 border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Complete Your Coach Profile
              </CardTitle>
              <CardDescription>
                Set up your coaching profile to start managing clients and tracking their emotional resilience journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/coach/setup">
                <Button>Create Coach Profile</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Clients</CardTitle>
                  <Users className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalClients}</div>
                  <p className="text-xs text-gray-500 mt-1">{stats.activeClients} active</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Journal Entries</CardTitle>
                  <BookOpen className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">-</div>
                  <p className="text-xs text-gray-500 mt-1">Across all clients</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">AI Insights</CardTitle>
                  <Brain className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.recentInsights}</div>
                  <p className="text-xs text-gray-500 mt-1">New this week</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Sessions</CardTitle>
                  <Calendar className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalSessions}</div>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to manage your coaching practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/clients/new">
                    <Button className="w-full" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Add New Client
                    </Button>
                  </Link>
                  <Link href="/clients">
                    <Button className="w-full" variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View All Clients
                    </Button>
                  </Link>
                  <Link href="/insights">
                    <Button className="w-full" variant="outline">
                      <Brain className="mr-2 h-4 w-4" />
                      AI Insights
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Clients */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Clients</CardTitle>
                    <CardDescription>Your most recently added or updated clients</CardDescription>
                  </div>
                  <Link href="/clients">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {clients && clients.length > 0 ? (
                  <div className="space-y-4">
                    {clients.slice(0, 5).map((client) => (
                      <Link key={client.id} href={`/clients/${client.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{client.name}</p>
                              <p className="text-sm text-gray-500">{client.email || "No email"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              client.status === "active" ? "bg-green-100 text-green-800" :
                              client.status === "inactive" ? "bg-gray-100 text-gray-800" :
                              "bg-blue-100 text-blue-800"
                            }`}>
                              {client.status}
                            </span>
                            <TrendingUp className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No clients yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding your first client.</p>
                    <div className="mt-6">
                      <Link href="/clients/new">
                        <Button>
                          <Users className="mr-2 h-4 w-4" />
                          Add Client
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
