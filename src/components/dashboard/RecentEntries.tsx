"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EntriesList } from "@/components/EntriesList";
import { useLiveQuery } from "dexie-react-hooks";
import { dbHelpers } from "@/lib/db";
import { motion } from "framer-motion";
import { Receipt, TrendingUp, PiggyBank, Users, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecentEntries() {
  const [showEntries, setShowEntries] = useState(true);
  
  // Get recent data (last 5 entries of each type)
  const recentExpenses = useLiveQuery(async () => {
    const expenses = await dbHelpers.db.expenses.orderBy('date').reverse().limit(5).toArray();
    return expenses;
  }, []);

  const recentIncomes = useLiveQuery(async () => {
    const incomes = await dbHelpers.db.incomes.orderBy('date').reverse().limit(5).toArray();
    return incomes;
  }, []);

  const recentInvestments = useLiveQuery(async () => {
    const investments = await dbHelpers.db.investments.orderBy('date').reverse().limit(5).toArray();
    return investments;
  }, []);

  const recentLentMoney = useLiveQuery(async () => {
    const lentMoney = await dbHelpers.db.lentMoney.orderBy('givenDate').reverse().limit(5).toArray();
    return lentMoney;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="px-4 pb-20"
    >
      <Card className="glass border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg sm:text-xl font-bold gradient-text">
            Recent Transactions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEntries(!showEntries)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {showEntries ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </CardHeader>
        
        {showEntries && (
          <CardContent className="space-y-4">
            <Tabs defaultValue="expenses" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="expenses" className="text-xs sm:text-sm">
                  <Receipt className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Expenses</span>
                  <span className="sm:hidden">Exp</span>
                </TabsTrigger>
                <TabsTrigger value="income" className="text-xs sm:text-sm">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Income</span>
                  <span className="sm:hidden">Inc</span>
                </TabsTrigger>
                <TabsTrigger value="investments" className="text-xs sm:text-sm">
                  <PiggyBank className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Investments</span>
                  <span className="sm:hidden">Inv</span>
                </TabsTrigger>
                <TabsTrigger value="lent" className="text-xs sm:text-sm">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Lent</span>
                  <span className="sm:hidden">Lent</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="expenses" className="mt-4">
                {recentExpenses && (
                  <EntriesList 
                    entries={recentExpenses} 
                    type="expense"
                    onUpdate={() => window.location.reload()} 
                  />
                )}
              </TabsContent>

              <TabsContent value="income" className="mt-4">
                {recentIncomes && (
                  <EntriesList 
                    entries={recentIncomes} 
                    type="income"
                    onUpdate={() => window.location.reload()} 
                  />
                )}
              </TabsContent>

              <TabsContent value="investments" className="mt-4">
                {recentInvestments && (
                  <EntriesList 
                    entries={recentInvestments} 
                    type="investment"
                    onUpdate={() => window.location.reload()} 
                  />
                )}
              </TabsContent>

              <TabsContent value="lent" className="mt-4">
                {recentLentMoney && (
                  <EntriesList 
                    entries={recentLentMoney} 
                    type="lent"
                    onUpdate={() => window.location.reload()} 
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
